package de.docalvers.docfit;

import java.util.Locale;

/**
 * Waist and hip circumference, typed in by hand (Doc, 20.11.2026: "Zum Eingeben brauchen wir noch irgendwo ein Feld für
 * Bauchumfang", "ja, bitte auch ein Feld für Hüftumfang"), and the two ratios made of them. Kept with a weigh-in in mm
 * (one decimal of a cm). Pure Java, tested in GirthsTest.
 *
 * - Waist-to-height ratio WHtR = waist / height (from the profile) - the main waist value, Doc wants a smaller waist.
 *   Reading after Ashwell M, Gibson S. Waist-to-height ratio as an indicator of 'early health risk': simpler and more
 *   predictive than using a 'matrix' based on BMI and waist circumference. BMJ Open 2016;6:e010159
 *   (doi:10.1136/bmjopen-2015-010159), "keep your waist to less than half your height": below 0.5 good, 0.5 to below
 *   0.6 increased, from 0.6 high.
 * - Waist-to-hip ratio WHR = waist / hip. Reading after the WHO: Waist circumference and waist-hip ratio, report of a
 *   WHO expert consultation, Geneva 2008 (WHO 2011, ISBN 978 92 4 150149 1): from 0.90 (men) / 0.85 (women) a
 *   substantially increased risk of metabolic complications; below that normal. Needs the sex from the profile.
 *
 * Both ratios are cut (not rounded) to two decimals: the cut-offs sit on whole hundredths, so the number shown and its
 * reading always agree with the exact rule - 0.596 shows "0,59 · erhöht", never "0,60" with a word that does not fit. Measured where Ashwell and the WHO say: the waist midway between the lowest rib and the top of the hip bone,
 * the hip around the widest part of the buttocks, standing, after breathing out.
 */
final class Girths {
    /** a plausible circumference for an adult, in mm (50 to 200 cm) */
    static final int MIN_MM = 500, MAX_MM = 2000;

    /** the cut-offs in hundredths: WHtR (Ashwell) increased from 0.50, high from 0.60; WHR (WHO) men 0.90, women 0.85 */
    static final int WHTR_INCREASED = 50, WHTR_HIGH = 60, WHR_MEN = 90, WHR_WOMEN = 85;

    enum Band { GOOD, INCREASED, HIGH }

    private Girths() {
    }

    /**
     * What was typed into a field, in mm: "94,5", "94.5", "94" or "94,5 cm"; 0 for an empty field, -1 for anything
     * else or a circumference outside 50-200 cm. More than one decimal is rounded to one.
     */
    static int parseMm(String typed) {
        if (typed == null) return 0;
        String s = typed.trim().toLowerCase(Locale.ROOT);
        if (s.endsWith("cm")) s = s.substring(0, s.length() - 2).trim();
        if (s.isEmpty()) return 0;
        s = s.replace(',', '.');
        if (!s.matches("\\d{1,3}(\\.\\d+)?")) return -1;
        long mm = Math.round(Double.parseDouble(s) * 10);
        return mm >= MIN_MM && mm <= MAX_MM ? (int) mm : -1;
    }

    /** "94,5 cm", "–" for none. */
    static String cm(int mm) {
        return mm > 0 ? field(mm) + " cm" : "–";
    }

    /** The value as it stands in an input field: "94,5", "" for none. */
    static String field(int mm) {
        return mm > 0 ? String.format(Locale.GERMANY, "%.1f", mm / 10.0) : "";
    }

    /** A ratio in hundredths as shown: "0,52", "–" for none. */
    static String ratio(int hundredths) {
        return hundredths > 0 ? String.format(Locale.GERMANY, "%.2f", hundredths / 100.0) : "–";
    }

    /** WHtR in whole hundredths, cut (52 = 0.52..0.529), 0 when the waist or a usable height is missing. */
    static int waistToHeight(int waistMm, int heightCm) {
        if (waistMm <= 0 || heightCm < Profile.MIN_HEIGHT || heightCm > Profile.MAX_HEIGHT) return 0;
        return waistMm * 10 / heightCm;   // waist / (height * 10 mm) * 100, integer division = cut
    }

    /** Ashwell: below 0.5 good, 0.5 to below 0.6 increased, from 0.6 high; null without a ratio. */
    static Band waistToHeightBand(int hundredths) {
        if (hundredths <= 0) return null;
        return hundredths < WHTR_INCREASED ? Band.GOOD : hundredths < WHTR_HIGH ? Band.INCREASED : Band.HIGH;
    }

    /** WHR in whole hundredths, cut (92 = 0.92..0.929), 0 when the waist or the hip is missing. */
    static int waistToHip(int waistMm, int hipMm) {
        if (waistMm <= 0 || hipMm <= 0) return 0;
        return waistMm * 100 / hipMm;
    }

    /** WHO: from 0.90 (men) / 0.85 (women) increased, below that good; null without a ratio or without the sex. */
    static Band waistToHipBand(int hundredths, char sex) {
        if (hundredths <= 0) return null;
        int limit = sex == Profile.MALE ? WHR_MEN : sex == Profile.FEMALE ? WHR_WOMEN : 0;
        if (limit == 0) return null;
        return hundredths < limit ? Band.GOOD : Band.INCREASED;
    }
}
