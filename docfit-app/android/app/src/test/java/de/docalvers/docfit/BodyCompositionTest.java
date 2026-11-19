package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * The body-composition equations (Sun et al. 2003, Janssen et al. 2000, BMI) against known values.
 *
 * Person A is the reference case of openScale's StandardImpedanceLibTest (man, 30 years, 80 kg, 1.80 m, 527 ohms),
 * which uses the same equations: BMI 24.691, fat 24.222 %, skeletal muscle 39.313 % of the weight (= 31.4505 kg),
 * water 53.819 % - openScale scales the litres by 0.99513, DocFit takes 1 L = 1 kg, so 53.819 / 0.99513 = 54.083 %.
 * Person B (woman, 45 years, 65 kg, 1.68 m, 560 ohms) is worked out by hand from the published equations.
 * Neither is anybody's real profile.
 */
public class BodyCompositionTest {
    private static final double EPS = 1e-3;

    @Test
    public void referenceMan() {
        BodyComposition b = BodyComposition.of(80, 527, 180, 30, Profile.MALE);
        assertEquals(24.691, b.bmi, EPS);
        assertEquals(24.222, b.fatPercent, EPS);
        assertEquals(31.4505, b.muscleKg, EPS);
        assertEquals(39.313, b.muscleKg / 80 * 100, EPS);
        assertEquals(54.0825, b.waterPercent, EPS);
        assertEquals(53.819, b.waterPercent * 0.99513, EPS);   // openScale's figure with its litre factor
    }

    @Test
    public void handWorkedWoman() {
        // H²/R = 168² / 560 = 50.4
        // FFM = -9.53 + 0.69 * 50.4 + 0.17 * 65 + 0.02 * 560 = 47.496 kg -> fat (1 - 47.496 / 65) * 100 = 26.9292 %
        // TBW = 3.75 + 0.45 * 50.4 + 0.11 * 65 = 33.58 L -> 51.6615 %
        // SM  = 0.401 * 50.4 + 0 - 0.071 * 45 + 5.102 = 22.1174 kg
        // BMI = 65 / 1.68² = 23.0300
        BodyComposition b = BodyComposition.of(65, 560, 168, 45, Profile.FEMALE);
        assertEquals(23.0300, b.bmi, EPS);
        assertEquals(26.9292, b.fatPercent, EPS);
        assertEquals(51.6615, b.waterPercent, EPS);
        assertEquals(22.1174, b.muscleKg, EPS);
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
