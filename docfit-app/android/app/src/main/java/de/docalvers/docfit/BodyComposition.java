package de.docalvers.docfit;

/**
 * Fat, water, muscle and BMI from the scale's weight and resistance plus the profile. The Vitafit sends only weight
 * and resistance; the numbers its own app shows are computed on the phone, so DocFit computes them too - with
 * published equations instead of a vendor's secret ones. Pure Java, tested in BodyCompositionTest.
 *
 * With H = height, Z = resistance in ohms, W = weight in kg, A = age in years:
 * - Body fat % (Jebb SA, Cole TJ, Doman D, Murgatroyd PR, Prentice AM. Evaluation of the novel Tanita body-fat
 *   analyser to measure body composition by comparison with a four-compartment model. Br J Nutr 2000;83:115-122,
 *   doi:10.1017/S0007114500000155) - made for a FOOT-TO-FOOT scale like the Vitafit, against the four-compartment
 *   model, both sexes: %fat = -156.1 - 89.1 ln H + 45.6 ln W + 0.120 A + 0.0494 Z (+ 19.6 ln H for women).
 *   The paper says "height in cm", but its coefficients only give sensible values with H in METRES (with cm a man of
 *   1.80 m, 80 kg, 30 years, 500 ohms would have -391 %; with m he has 19.7 %). Until 21.11.2026 DocFit used Sun 2003
 *   (hand-to-foot, a lab analyser), which reads foot-to-foot resistance far too low for women (by 7-8 points).
 * - Fat-free mass = W - fat; total body water = 0.73 x fat-free mass (its usual hydration), Water % = TBW / W.
 * - Skeletal muscle mass, an estimate (Janssen I, Heymsfield SB, Baumgartner RN, Ross R. Estimation of skeletal
 *   muscle mass by bioelectrical impedance analysis. J Appl Physiol 2000;89:465-471, doi:10.1152/jappl.2000.89.2.465,
 *   hand-to-foot): SM = 0.401 H(cm)²/Z + 3.825 S - 0.071 A + 5.102 (kg), S = 1 for men, 0 for women.
 * - BMI = W / H(m)².
 * - Plausibility: Gallagher D et al., Am J Clin Nutr 2000;72:694-701 (body fat from BMI, age and sex):
 *   %fat = 64.5 - 848/BMI + 0.079 A - 16.4 S + 0.05 S A + 39.0 S/BMI. A result from the resistance more than 8 points
 *   away from it, or below essential fat (women 13 %, men 5 %), is marked implausible - most often a bad contact.
 *
 * Honest limits: estimates; the trend over weeks is what counts. Measure under the same conditions (morning,
 * barefoot, not right after the workout).
 */
final class BodyComposition {
    /** Outside this range the resistance is a bad contact (socks, dry or wet feet), not a body. */
    static final int MIN_OHM = 150, MAX_OHM = 1500;

    /**
     * Whether a resistance from the scale is a measurement of a body. 0 (not measured), the scale's 0xFFFF (could
     * not measure) and anything else outside the range are not - such a weigh-in has a weight only.
     */
    static boolean isMeasured(int ohm) {
        return ohm >= MIN_OHM && ohm <= MAX_OHM;
    }

    /** More than this many points from Gallagher's estimate, the body fat from the resistance is implausible. */
    static final double MAX_GAP = 8;
    /** Below essential fat a result is implausible too (ACE: women 10-13 %, men 2-5 %; the upper ends). */
    static final double ESSENTIAL_WOMEN = 13, ESSENTIAL_MEN = 5;

    /** NaN where a value cannot be computed (no resistance, profile incomplete, result impossible). */
    final double bmi, fatPercent, waterPercent, muscleKg;
    /** Gallagher's body fat from BMI, age and sex (NaN without them) - the check for the resistance's result */
    final double gallagherPercent;
    /** the body fat from the resistance is far from Gallagher's or below essential fat: "unplausibel" */
    final boolean fatImplausible;

    private BodyComposition(double bmi, double fatPercent, double waterPercent, double muscleKg, double gallagher,
                            boolean implausible) {
        this.bmi = bmi;
        this.fatPercent = fatPercent;
        this.waterPercent = waterPercent;
        this.muscleKg = muscleKg;
        this.gallagherPercent = gallagher;
        this.fatImplausible = implausible;
    }

    /** Gallagher 2000: body fat % from BMI, age and sex (men S = 1). */
    static double gallagher(double bmi, int age, boolean male) {
        int sx = male ? 1 : 0;
        return 64.5 - 848 / bmi + 0.079 * age - 16.4 * sx + 0.05 * sx * age + 39.0 * sx / bmi;
    }

    /** Whether a body fat from the resistance cannot be right: far from Gallagher's, or below essential fat. */
    static boolean implausible(double fat, double gallagher, boolean male) {
        if (Double.isNaN(fat)) return false;
        return fat < (male ? ESSENTIAL_MEN : ESSENTIAL_WOMEN) || (!Double.isNaN(gallagher)
                && Math.abs(fat - gallagher) > MAX_GAP);
    }

    /**
     * @param weightKg weight in kg
     * @param ohm      resistance between the feet in ohms, 0 = not measured
     * @param heightCm height in cm, 0 = unknown (then not even the BMI)
     * @param age      age in years, 0 = unknown
     * @param sex      Profile.MALE, Profile.FEMALE or Profile.UNSET
     */
    static BodyComposition of(double weightKg, int ohm, int heightCm, int age, char sex) {
        double nan = Double.NaN;
        if (weightKg <= 0 || heightCm < Profile.MIN_HEIGHT || heightCm > Profile.MAX_HEIGHT) {
            return new BodyComposition(nan, nan, nan, nan, nan, false);
        }
        double m = heightCm / 100.0;
        double bmi = weightKg / (m * m);
        boolean male = sex == Profile.MALE;
        boolean known = male || sex == Profile.FEMALE;
        double gal = known && age > 0 ? gallagher(bmi, age, male) : nan;
        if (!isMeasured(ohm) || age <= 0 || !known) {
            return new BodyComposition(bmi, nan, nan, nan, gal, false);
        }
        double lnH = Math.log(m);   // metres - see the class comment
        double fat = -156.1 - 89.1 * lnH + 45.6 * Math.log(weightKg) + 0.120 * age + 0.0494 * ohm
                + (male ? 0 : 19.6 * lnH);
        fat = plausible(fat, 0, 100);
        double water = Double.isNaN(fat) ? nan : plausible(0.73 * (100 - fat), 0, 100);   // 0.73 x FFM, in % of W
        double h2r = (double) heightCm * heightCm / ohm;
        double sm = 0.401 * h2r + (male ? 3.825 : 0) - 0.071 * age + 5.102;
        return new BodyComposition(bmi, fat, water, plausible(sm, 0, weightKg), gal, implausible(fat, gal, male));
    }

    /** For one weigh-in: the age is taken in the year of the weigh-in, so old entries stay as they were. */
    static BodyComposition of(Weighings.Weighing w, Profile p) {
        java.util.Calendar c = java.util.Calendar.getInstance();
        c.setTimeInMillis(w.time);
        return of(w.kg(), w.ohm, p.heightCm, p.ageIn(c.get(java.util.Calendar.YEAR)), p.sex);
    }

    private static double plausible(double v, double min, double max) {
        return v > min && v < max ? v : Double.NaN;
    }
}
