package de.docalvers.docfit;

/**
 * Fat, water, muscle and BMI from the scale's weight and resistance plus the profile. The Vitafit sends only weight
 * and resistance; the numbers its own app shows are computed on the phone, so DocFit computes them too - with
 * published equations instead of a vendor's secret ones. They are the equations openScale applies to this scale
 * (StandardImpedanceLib), taken here from the papers and written anew. Pure Java, tested in BodyCompositionTest.
 *
 * With H = height in cm, R = resistance in ohms, W = weight in kg, A = age in years:
 * - Fat-free mass (Sun SS, Chumlea WC, Heymsfield SB et al., Development of bioelectrical impedance analysis
 *   prediction equations for body composition with the use of a multicomponent model for use in epidemiologic
 *   surveys. Am J Clin Nutr 2003;77:331-340, doi:10.1093/ajcn/77.2.331), race-combined equations:
 *   men FFM = -10.68 + 0.65 H²/R + 0.26 W + 0.02 R, women FFM = -9.53 + 0.69 H²/R + 0.17 W + 0.02 R (kg).
 *   Body fat % = (1 - FFM / W) * 100.
 * - Total body water (same paper): men TBW = 1.20 + 0.45 H²/R + 0.18 W, women TBW = 3.75 + 0.45 H²/R + 0.11 W
 *   (litres). Water % = TBW / W * 100, one litre of body water taken as one kilogram (openScale additionally scales
 *   by 0.99513, which moves the result by half a percent of itself - well inside the equation's error of 3.8 L).
 * - Skeletal muscle mass (Janssen I, Heymsfield SB, Baumgartner RN, Ross R. Estimation of skeletal muscle mass by
 *   bioelectrical impedance analysis. J Appl Physiol 2000;89:465-471, doi:10.1152/jappl.2000.89.2.465):
 *   SM = 0.401 H²/R + 3.825 S - 0.071 A + 5.102 (kg), S = 1 for men, 0 for women.
 * - BMI = W / (H/100)².
 *
 * Honest limits: the equations were made with hand-to-foot resistance from a lab analyser, the Vitafit measures
 * foot to foot; the absolute numbers are estimates, the trend over weeks is what counts. Measure under the same
 * conditions (morning, barefoot, not right after the workout).
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

    /** NaN where a value cannot be computed (no resistance, profile incomplete, result impossible). */
    final double bmi, fatPercent, waterPercent, muscleKg;

    private BodyComposition(double bmi, double fatPercent, double waterPercent, double muscleKg) {
        this.bmi = bmi;
        this.fatPercent = fatPercent;
        this.waterPercent = waterPercent;
        this.muscleKg = muscleKg;
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
            return new BodyComposition(nan, nan, nan, nan);
        }
        double m = heightCm / 100.0;
        double bmi = weightKg / (m * m);
        boolean male = sex == Profile.MALE;
        if (!isMeasured(ohm) || age <= 0 || (!male && sex != Profile.FEMALE)) {
            return new BodyComposition(bmi, nan, nan, nan);
        }
        double h2r = (double) heightCm * heightCm / ohm;
        double ffm = male ? -10.68 + 0.65 * h2r + 0.26 * weightKg + 0.02 * ohm
                : -9.53 + 0.69 * h2r + 0.17 * weightKg + 0.02 * ohm;
        double tbw = male ? 1.20 + 0.45 * h2r + 0.18 * weightKg
                : 3.75 + 0.45 * h2r + 0.11 * weightKg;
        double sm = 0.401 * h2r + (male ? 3.825 : 0) - 0.071 * age + 5.102;
        return new BodyComposition(bmi,
                plausible((1 - ffm / weightKg) * 100, 0, 100),
                plausible(tbw / weightKg * 100, 0, 100),
                plausible(sm, 0, weightKg));
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
