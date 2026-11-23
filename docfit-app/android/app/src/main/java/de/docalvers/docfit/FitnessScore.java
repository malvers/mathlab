package de.docalvers.docfit;

import java.util.Locale;

/**
 * A fitness score from 1 to 10 for the newest weigh-in, with what the values mean in plain German (Doc, 19.11.2026:
 * "Ein Indikator von grottenschlecht bis 10 Top-Athlet"). An orientation, not a medical judgement. Pure Java, tested
 * in FitnessScoreTest.
 *
 * Basis: the body-fat share (BodyComposition), placed in published ranges for the sex and age group:
 * - Gallagher D, Heymsfield SB, Heo M, Jebb SA, Murgatroyd PR, Sakamoto Y. Healthy percentage body fat ranges: an
 *   approach for developing guidelines based on body mass index. Am J Clin Nutr 2000;72:694-701,
 *   doi:10.1093/ajcn/72.3.694 - the body fat that goes with the BMI limits 18.5, 25 and 30, as commonly tabulated
 *   (white adults): men 20-39 / 40-59 / 60-79 years "healthy" from 8 / 11 / 13 % and below 20 / 22 / 25 %, "obese"
 *   from 25 / 28 / 30 %; women from 21 / 23 / 24 %, below 33 / 34 / 36 %, from 39 / 40 / 42 %.
 * - American Council on Exercise (ACE) body-fat categories: essential fat men 2-5 % / women 10-13 %, athletes 6-13 /
 *   14-20 %, fitness 14-17 / 21-24 %, average 18-24 / 25-31 %, obese from 25 / 32 %. ACE gives no age groups; the
 *   fitness and average limits are moved up by as much as Gallagher's healthy limit rises with age (men +2 / +5,
 *   women +1 / +3) - our own combination, so a fit 65-year-old is compared with fit 65-year-olds.
 * The top band starts at Gallagher's lower healthy limit, the same age-based limit where the body-fat tile turns green
 * (Ranges.fat), not at ACE's athletes' limit (men 6 %, women 14 %) - so the score and the tile always agree: no
 * "Top-Athlet" for a value the tile calls "sehr wenig" (20.11.2026). For women Gallagher's healthy range begins above
 * ACE's athletes and even at or above ACE's fitness limit (21 / 23 / 24 % against 21 / 22 / 24 %); so that the top band
 * never vanishes, the fitness limit is at least the middle between the lower healthy limit and ACE average, as a whole
 * number (women 23 / 24 / 26 %; for men ACE's limit is always higher and stays) - our own combination as well.
 *
 * Bands (each two points; the lower half of a band gets the higher point):
 *   9-10 "Top-Athlet"   from Gallagher's lower healthy limit (below it too little in the long run: 7)
 *   7-8  "fit"          ACE fitness
 *   5-6  "solide"       from ACE average up to Gallagher's healthy limit
 *   3-4  "ausbaufähig"  Gallagher overweight (healthy limit up to the obese limit)
 *   1-2  "grottenschlecht" Gallagher obese (2 for the first band width above the limit, then 1)
 * Small corrections, one point each, down to 1 at the least:
 * - BMI (WHO: below 18.5 underweight, 18.5-24.9 normal, 25-29.9 overweight, from 30 obese): -1 below 18.5 and from 30.
 *   Overweight by BMI alone costs nothing - with muscles a BMI above 25 is normal, the body fat already decides.
 * - Skeletal muscle (Janssen I, Baumgartner RN, Ross R, Rosenberg IH, Roubenoff R. Skeletal muscle cutpoints
 *   associated with elevated physical disability risk in older men and women. Am J Epidemiol 2004;159:413-421,
 *   doi:10.1093/aje/kwh058): muscle mass by the same BIA equation (Janssen 2000) per height², high risk at
 *   <= 8.50 kg/m² for men and <= 5.75 kg/m² for women: -1.
 * Values are compared as shown, to one decimal, so "20,0 %" on screen is in the same band as in the sentence.
 */
final class FitnessScore {
    static final String[] WORDS = {"grottenschlecht", "ausbaufähig", "solide", "fit", "Top-Athlet"};
    static final String DISCLAIMER = "Orientierung, keine ärztliche Bewertung";
    static final String HINT_PROFILE = "Fitness-Einordnung erst mit vollständigem Profil.";
    static final String HINT_FAT = "Fitness-Einordnung erst, wenn die Waage Körperfett misst.";
    static final String HINT_IMPLAUSIBLE = "Körperfett unplausibel – bitte noch einmal wiegen, barfuß und still stehen.";
    static final double BMI_UNDER = 18.5, BMI_OBESE = 30, BMI_OVER = 25;
    static final double SMI_LOW_MEN = 8.50, SMI_LOW_WOMEN = 5.75;

    /** 1..10; 0 = no score, then {@link #text} is the hint why. */
    final int score;
    /** One or two German sentences about the values, or the hint. */
    final String text;

    private FitnessScore(int score, String text) {
        this.score = score;
        this.text = text;
    }

    /** "grottenschlecht" for 1-2 ... "Top-Athlet" for 9-10, "" without a score. */
    static String word(int score) {
        return score < 1 || score > 10 ? "" : WORDS[(score - 1) / 2];
    }

    /**
     * The score as a weigh-in row shows it behind its date: "7 fit" (Doc, 23.11.2026: "hinter das Datum die jeweilige
     * Note, also '7 fit', in der entsprechenden Farbe"), "" without a score.
     */
    static String label(int score) {
        return score < 1 || score > 10 ? "" : score + " " + word(score);
    }

    /**
     * Where the bands start for one sex and age group, in % body fat. {@code lean} is Gallagher's lower healthy limit
     * (the body fat that goes with BMI 18.5): men 20-39 / 40-59 / 60-79 from 8 / 11 / 13 %, women 21 / 23 / 24 % - the
     * start of the green band in the tile (Ranges.fat) and of the score's top band.
     */
    static final class Limits {
        final double lean, fitness, average, overweight, obese;
        final String group;   // "für Männer ab 60"

        Limits(double lean, double fitness, double average, double overweight, double obese, String group) {
            this.lean = lean;
            this.fitness = fitness;
            this.average = average;
            this.overweight = overweight;
            this.obese = obese;
            this.group = group;
        }
    }

    /** Gallagher's age groups 20-39, 40-59, 60-79; younger counts as 20-39, older as 60-79. */
    static Limits limits(char sex, int age) {
        int g = age < 40 ? 0 : age < 60 ? 1 : 2;
        boolean male = sex == Profile.MALE;
        double[] lean = male ? new double[]{8, 11, 13} : new double[]{21, 23, 24};       // Gallagher, BMI 18.5
        double[] healthy = male ? new double[]{20, 22, 25} : new double[]{33, 34, 36};   // Gallagher, BMI 25
        double[] obese = male ? new double[]{25, 28, 30} : new double[]{39, 40, 42};     // Gallagher, BMI 30
        double shift = healthy[g] - healthy[0];
        String who = male ? "Männer" : "Frauen";
        String[] ages = {"bis 39", "von 40 bis 59", "ab 60"};
        double average = (male ? 18 : 25) + shift;                                       // ACE average
        // ACE fitness, but never so low that the top band from lean vanishes (only women; see the class comment)
        double fitness = Math.max((male ? 14 : 21) + shift, Math.floor((lean[g] + average) / 2));
        return new Limits(lean[g], fitness, average, healthy[g], obese[g], "für " + who + " " + ages[g]);
    }

    /** The score from body fat alone (before the corrections). */
    static int fatScore(double fat, Limits l) {
        if (fat < l.lean) return 7;
        if (fat < l.fitness) return halves(fat, l.lean, l.fitness, 10);
        if (fat < l.average) return halves(fat, l.fitness, l.average, 8);
        if (fat < l.overweight) return halves(fat, l.average, l.overweight, 6);
        if (fat < l.obese) return halves(fat, l.overweight, l.obese, 4);
        return halves(fat, l.obese, l.obese + 2 * (l.obese - l.overweight), 2);
    }

    private static int halves(double v, double from, double to, int best) {
        return v < (from + to) / 2 ? best : best - 1;
    }

    /**
     * @param fatPercent body fat in %, NaN = not measured
     * @param bmi        NaN = unknown
     * @param muscleKg   skeletal muscle in kg, NaN = unknown (then no muscle correction)
     * @param heightCm   height in cm
     * @param age        age in years, 0 = unknown
     * @param sex        Profile.MALE or Profile.FEMALE
     */
    static FitnessScore of(double fatPercent, double bmi, double muscleKg, int heightCm, int age, char sex) {
        if (age <= 0 || heightCm <= 0 || (sex != Profile.MALE && sex != Profile.FEMALE)) {
            return new FitnessScore(0, HINT_PROFILE);
        }
        if (Double.isNaN(fatPercent)) return new FitnessScore(0, HINT_FAT);
        double fat = tenth(fatPercent);
        Limits l = limits(sex, age);
        int score = fatScore(fat, l);
        StringBuilder s = new StringBuilder("Körperfett ").append(Times.one(fat, "%")).append(": ")
                .append(fatWords(fat, l)).append('.');

        StringBuilder minus = new StringBuilder();
        int points = 0;
        if (!Double.isNaN(bmi)) {
            double b = tenth(bmi);
            if (b < BMI_UNDER || b >= BMI_OBESE) {
                points++;
                minus.append("BMI ").append(Times.one(b, "")).append(" (WHO: ").append(bmiWord(b)).append(')');
            }
        }
        if (!Double.isNaN(muscleKg)) {
            double m = heightCm / 100.0;
            double smi = muscleKg / (m * m);
            if (smi <= (sex == Profile.MALE ? SMI_LOW_MEN : SMI_LOW_WOMEN)) {
                points++;
                if (minus.length() > 0) minus.append(", ");
                minus.append("wenig Muskelmasse (").append(Times.one(smi, "kg/m²")).append(')');
            }
        }
        if (points > 0) {
            s.append(points == 1 ? " Ein Punkt Abzug: " : " Je ein Punkt Abzug: ").append(minus).append('.');
        } else if (!Double.isNaN(bmi)) {
            double b = tenth(bmi);
            s.append(" BMI ").append(Times.one(b, "")).append(" – laut WHO ").append(bmiWord(b)).append('.');
        }
        return new FitnessScore(Math.max(1, Math.min(10, score - points)), s.toString());
    }

    /** For the newest weigh-in: the age in the year of the weigh-in, as BodyComposition takes it. */
    static FitnessScore of(Weighings.Weighing w, Profile p) {
        if (!p.complete()) return new FitnessScore(0, HINT_PROFILE);
        if (!w.hasResistance()) return new FitnessScore(0, HINT_FAT);
        java.util.Calendar c = java.util.Calendar.getInstance();
        c.setTimeInMillis(w.time);
        BodyComposition bc = BodyComposition.of(w, p);
        if (bc.fatImplausible) return new FitnessScore(0, HINT_IMPLAUSIBLE);   // no grade from a bad contact
        return of(bc.fatPercent, bc.bmi, bc.muscleKg, p.heightCm, p.ageIn(c.get(java.util.Calendar.YEAR)), p.sex);
    }

    private static String fatWords(double fat, Limits l) {
        if (fat < l.lean) {
            return "sehr wenig – unter dem gesunden Bereich (ab " + pct(l.lean) + "), auf Dauer zu wenig";
        }
        if (fat < l.fitness) return l.group + " im Bereich von Leistungssportlern";
        if (fat < l.average) return l.group + " fit – Leistungssportler liegen unter " + pct(l.fitness);
        if (fat < l.overweight) return l.group + " im gesunden Bereich, Sportler liegen unter " + pct(l.average);
        if (fat < l.obese) return l.group + " etwas viel – gesund ist unter " + pct(l.overweight);
        return l.group + " deutlich zu viel – gesund ist unter " + pct(l.overweight);
    }

    static String bmiWord(double bmi) {
        if (bmi < BMI_UNDER) return "Untergewicht";
        if (bmi < BMI_OVER) return "Normalgewicht";
        if (bmi < BMI_OBESE) return "Übergewicht";
        return "Adipositas";
    }

    private static String pct(double v) {
        return String.format(Locale.GERMANY, "%.0f %%", v);
    }

    private static double tenth(double v) {
        return Math.round(v * 10) / 10.0;
    }
}
