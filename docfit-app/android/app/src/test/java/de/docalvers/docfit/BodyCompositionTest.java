package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * The body-composition equations (Jebb et al. 2000 for a foot-to-foot scale, water as 0.73 of the fat-free mass,
 * Janssen et al. 2000, BMI) and the plausibility check against Gallagher et al. 2000, against values worked out by hand.
 *
 * The test man (30 years, 80 kg, 1.80 m, 500 ohms) is the check that Jebb's height belongs in metres: 19.7 % body fat.
 * The test woman (45 years, 62 kg, 1.65 m, 520 ohms) is worked out the same way. Neither is anybody's real profile.
 */
public class BodyCompositionTest {
    private static final double EPS = 1e-3;

    @Test
    public void jebbTestManHeightInMetres() {
        // fat = -156.1 - 89.1 ln 1.80 + 45.6 ln 80 + 0.120 * 30 + 0.0494 * 500 = 19.6486 %
        // water = 0.73 * (100 - 19.6486) = 58.6565 %; SM = 0.401 * 180² / 500 + 3.825 - 0.071 * 30 + 5.102 = 32.7818 kg
        BodyComposition b = BodyComposition.of(80, 500, 180, 30, Profile.MALE);
        assertEquals(24.6914, b.bmi, EPS);
        assertEquals(19.6486, b.fatPercent, EPS);
        assertEquals("19,6 %", Times.one(b.fatPercent, "%"));   // 19.65 rounded once more would be 19.7
        assertEquals(58.6565, b.waterPercent, EPS);
        assertEquals(32.7818, b.muscleKg, EPS);
        assertEquals(19.2055, b.gallagherPercent, EPS);
        assertTrue(!b.fatImplausible);
    }

    @Test
    public void jebbTestWoman() {
        // fat = -156.1 - 89.1 ln 1.65 + 19.6 ln 1.65 + 45.6 ln 62 + 0.120 * 45 + 0.0494 * 520 = 28.3814 %
        BodyComposition b = BodyComposition.of(62, 520, 165, 45, Profile.FEMALE);
        assertEquals(22.7732, b.bmi, EPS);
        assertEquals(28.3814, b.fatPercent, EPS);
        assertEquals(52.2815, b.waterPercent, EPS);
        assertEquals(22.9017, b.muscleKg, EPS);
        assertEquals(30.8182, b.gallagherPercent, EPS);
        assertTrue(!b.fatImplausible);
    }

    @Test
    public void implausibleWhenFarFromGallagherOrBelowEssentialFat() {
        assertTrue(BodyComposition.of(80, 800, 180, 30, Profile.MALE).fatImplausible);    // 34.5 % vs 19.2 %
        assertTrue(BodyComposition.of(80, 150, 180, 30, Profile.MALE).fatImplausible);    // 2.4 %: below 5 %
        assertTrue(BodyComposition.implausible(12.0, 14.0, false));                       // a woman below 13 %
        assertTrue(!BodyComposition.implausible(13.0, 14.0, false));
        assertTrue(BodyComposition.implausible(20.0, 28.1, true));                        // 8.1 points apart
        assertTrue(!BodyComposition.implausible(20.0, 28.0, true));                       // 8 points: still fine
        assertTrue(!BodyComposition.implausible(Double.NaN, 20, true));
        assertTrue(Double.isNaN(BodyComposition.of(80, 500, 180, 0, Profile.MALE).gallagherPercent));
    }

    @Test
    public void withoutResistanceOnlyTheBmi() {
        BodyComposition b = BodyComposition.of(80, 0, 180, 30, Profile.MALE);
        assertEquals(24.691, b.bmi, EPS);
        assertTrue(Double.isNaN(b.fatPercent));
        assertTrue(Double.isNaN(b.waterPercent));
        assertTrue(Double.isNaN(b.muscleKg));
    }

    @Test
    public void implausibleResistanceOnlyTheBmi() {
        assertTrue(Double.isNaN(BodyComposition.of(80, 40, 180, 30, Profile.MALE).fatPercent));
        assertTrue(Double.isNaN(BodyComposition.of(80, 5000, 180, 30, Profile.MALE).fatPercent));
        assertEquals(24.691, BodyComposition.of(80, 5000, 180, 30, Profile.MALE).bmi, EPS);
        assertTrue(Double.isNaN(BodyComposition.of(80, 0xFFFF, 180, 30, Profile.MALE).fatPercent));   // "could not"
    }

    @Test
    public void whichResistanceIsAMeasurement() {
        assertTrue(BodyComposition.isMeasured(527));
        assertTrue(BodyComposition.isMeasured(BodyComposition.MIN_OHM));
        assertTrue(BodyComposition.isMeasured(BodyComposition.MAX_OHM));
        assertTrue(!BodyComposition.isMeasured(0));
        assertTrue(!BodyComposition.isMeasured(BodyComposition.MIN_OHM - 1));
        assertTrue(!BodyComposition.isMeasured(BodyComposition.MAX_OHM + 1));
        assertTrue(!BodyComposition.isMeasured(0xFFFF));
    }

    @Test
    public void incompleteProfile() {
        BodyComposition noHeight = BodyComposition.of(80, 527, 0, 30, Profile.MALE);
        assertTrue(Double.isNaN(noHeight.bmi));
        assertTrue(Double.isNaN(noHeight.fatPercent));
        BodyComposition noSex = BodyComposition.of(80, 527, 180, 30, Profile.UNSET);
        assertEquals(24.691, noSex.bmi, EPS);
        assertTrue(Double.isNaN(noSex.fatPercent));
        BodyComposition noAge = BodyComposition.of(80, 527, 180, 0, Profile.MALE);
        assertTrue(Double.isNaN(noAge.muscleKg));
    }

    @Test
    public void profileRules() {
        assertTrue(!new Profile(0, 0, Profile.UNSET).complete());
        assertTrue(new Profile(180, 1990, Profile.MALE).complete());
        assertTrue(!new Profile(180, 1990, Profile.UNSET).complete());
        assertTrue(!new Profile(80, 1990, Profile.MALE).complete());      // 80 cm: not a height of an adult
        assertEquals(36, new Profile(180, 1990, Profile.MALE).ageIn(2026));
        assertEquals(0, new Profile(180, 0, Profile.MALE).ageIn(2026));
    }

    @Test
    public void numbersAreWrittenGerman() {
        assertEquals("85,00 kg", Times.kg(85));
        assertEquals("84,95 kg", Times.kg(84.95));
        assertEquals("24,2 %", Times.one(24.222, "%"));
        assertEquals("24,7", Times.one(24.691, ""));
        assertEquals("–", Times.one(Double.NaN, "%"));
        assertEquals("–", Times.kg(Double.NaN));
    }
}
