package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import org.junit.Test;

/**
 * Waist and hip typed in by hand and their ratios (Girths): what a field accepts, WHtR after Ashwell 2016 and WHR after
 * the WHO 2008. All values made up - the test man is 180 cm tall, born 1990, 85 kg; nobody real.
 */
public class GirthsTest {
    private static final int TEST_MAN_CM = 180;

    @Test
    public void fieldsTakeCentimetresWithCommaOrPoint() {
        assertEquals(905, Girths.parseMm("90,5"));
        assertEquals(905, Girths.parseMm("90.5"));
        assertEquals(900, Girths.parseMm("90"));
        assertEquals(905, Girths.parseMm(" 90,5 cm "));
        assertEquals(906, Girths.parseMm("90,55"));            // more than one decimal: rounded to one
        assertEquals(0, Girths.parseMm(""));                   // empty = not measured
        assertEquals(0, Girths.parseMm("   "));
        assertEquals(0, Girths.parseMm(null));
        assertEquals(500, Girths.parseMm("50"));               // the plausible range, 50 to 200 cm
        assertEquals(2000, Girths.parseMm("200"));
        assertEquals(-1, Girths.parseMm("49,9"));
        assertEquals(-1, Girths.parseMm("200,1"));
        assertEquals(-1, Girths.parseMm("9,05"));              // mm or a typo, not a waist
        assertEquals(-1, Girths.parseMm("90,5,1"));
        assertEquals(-1, Girths.parseMm("-90"));
        assertEquals(-1, Girths.parseMm("neunzig"));
    }

    @Test
    public void shownWithGermanComma() {
        assertEquals("90,5 cm", Girths.cm(905));
        assertEquals("100,0 cm", Girths.cm(1000));
        assertEquals("–", Girths.cm(0));
        assertEquals("90,5", Girths.field(905));
        assertEquals("", Girths.field(0));
        assertEquals("0,52", Girths.ratio(52));
        assertEquals("–", Girths.ratio(0));
    }

    @Test
    public void waistToHeightAfterAshwell() {
        // 89 cm / 180 cm = 0.494 -> "0,49", good
        assertEquals(49, Girths.waistToHeight(890, TEST_MAN_CM));
        assertEquals(Girths.Band.GOOD, Girths.waistToHeightBand(49));
        // exactly half the height: 0.50 is already increased ("less than half your height")
        assertEquals(50, Girths.waistToHeight(900, TEST_MAN_CM));
        assertEquals(Girths.Band.INCREASED, Girths.waistToHeightBand(50));
        // 89.9 / 180 = 0.4994 is still below half: cut to "0,49", good - never "0,50" with "gut" next to it
        assertEquals(49, Girths.waistToHeight(899, TEST_MAN_CM));
        assertEquals(Girths.Band.GOOD, Girths.waistToHeightBand(Girths.waistToHeight(899, TEST_MAN_CM)));
        // 107 / 180 = 0.594 -> 0.59, still increased; 108 / 180 = 0.60 high
        assertEquals(59, Girths.waistToHeight(1070, TEST_MAN_CM));
        assertEquals(Girths.Band.INCREASED, Girths.waistToHeightBand(59));
        assertEquals(60, Girths.waistToHeight(1080, TEST_MAN_CM));
        assertEquals(Girths.Band.HIGH, Girths.waistToHeightBand(60));
        // 107.9 / 180 = 0.5994: just below 0.6, shown "0,59", increased
        assertEquals(59, Girths.waistToHeight(1079, TEST_MAN_CM));
        assertEquals(Girths.Band.INCREASED, Girths.waistToHeightBand(59));
        // nothing without a waist or a usable height
        assertEquals(0, Girths.waistToHeight(0, TEST_MAN_CM));
        assertEquals(0, Girths.waistToHeight(900, 0));
        assertEquals(0, Girths.waistToHeight(900, 99));
        assertNull(Girths.waistToHeightBand(0));
    }

    @Test
    public void waistToHipAfterTheWho() {
        // 90 / 100 = 0.90: a man is at the WHO limit (increased), a woman far above hers
        assertEquals(90, Girths.waistToHip(900, 1000));
        assertEquals(Girths.Band.INCREASED, Girths.waistToHipBand(90, Profile.MALE));
        assertEquals(Girths.Band.GOOD, Girths.waistToHipBand(89, Profile.MALE));
        assertEquals(Girths.Band.INCREASED, Girths.waistToHipBand(85, Profile.FEMALE));
        assertEquals(Girths.Band.GOOD, Girths.waistToHipBand(84, Profile.FEMALE));
        // 85.4 / 100 = 0.854 -> 0.85 for a woman: increased, like the number shown; 84.9 / 100 -> 0.84 good
        assertEquals(85, Girths.waistToHip(854, 1000));
        assertEquals(84, Girths.waistToHip(849, 1000));
        // no reading without the sex, no ratio without both girths
        assertNull(Girths.waistToHipBand(90, Profile.UNSET));
        assertEquals(0, Girths.waistToHip(900, 0));
        assertEquals(0, Girths.waistToHip(0, 1000));
        assertNull(Girths.waistToHipBand(0, Profile.MALE));
    }
}
