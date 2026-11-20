package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * The reading behind every tile's range bar (Ranges): zones from the references the app already uses, the value placed
 * as shown, the reference line. Made-up values of the test man - 180 cm, born 1990 (36 in 2026), 85 kg; nobody real.
 */
public class RangesTest {
    private static final char M = Profile.MALE, W = Profile.FEMALE;

    @Test
    public void bodyFatAfterGallagherForSexAndAge() {
        Ranges.Scale s = Ranges.fat(18.2, M, 36);   // men 20-39: healthy from 8 and below 20, obese from 25
        assertEquals(Ranges.Zone.GOOD, s.zone());
        assertEquals("gesund 8–20 % (bis 39)", s.note);
        assertEquals(Ranges.Zone.BORDER, Ranges.fat(22, M, 36).zone());
        assertEquals(Ranges.Zone.HIGH, Ranges.fat(25, M, 36).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.fat(5, M, 36).zone());     // essential fat only
        assertEquals(Ranges.Zone.BORDER, Ranges.fat(7.9, M, 36).zone());   // below Gallagher's BMI-18.5 fat
        assertEquals(Ranges.Zone.GOOD, Ranges.fat(8, M, 36).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.fat(19.96, M, 36).zone()); // shown "20,0 %": no longer below 20
        // the green band starts with the age group: 8 / 11 / 13 % for men, no longer at ACE's 6 %
        assertEquals(Ranges.Zone.BORDER, Ranges.fat(10.9, M, 45).zone());
        assertEquals(Ranges.Zone.GOOD, Ranges.fat(11, M, 45).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.fat(6, M, 65).zone());
        assertEquals(Ranges.Zone.GOOD, Ranges.fat(12.96, M, 65).zone());   // shown "13,0 %": already green
        assertEquals(Ranges.Zone.BORDER, Ranges.fat(12.9, M, 65).zone());
        assertEquals(Ranges.Zone.GOOD, Ranges.fat(13, M, 65).zone());
        assertEquals("gesund 13–25 % (ab 60)", Ranges.fat(22, M, 65).note);
        assertEquals("gesund 11–22 % (40–59)", Ranges.fat(22, M, 45).note);
        assertEquals(Ranges.Zone.GOOD, Ranges.fat(22, M, 65).zone());
        assertEquals("gesund 21–33 % (bis 39)", Ranges.fat(30, W, 30).note);
        assertEquals(Ranges.Zone.BORDER, Ranges.fat(20.9, W, 30).zone());
        assertEquals(Ranges.Zone.GOOD, Ranges.fat(23, W, 45).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.fat(23.9, W, 65).zone());
        assertEquals(Ranges.Zone.GOOD, Ranges.fat(24, W, 65).zone());
        assertNull(Ranges.fat(18, Profile.UNSET, 36));
        assertNull(Ranges.fat(18, M, 0));
        Ranges.Scale none = Ranges.fat(Double.NaN, M, 36);   // weight only: the zones, no marker
        assertFalse(none.hasValue());
        assertNull(none.zone());
    }

    @Test
    public void waterTypicalRange() {
        assertEquals(Ranges.Zone.GOOD, Ranges.water(55, M).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.water(49.9, M).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.water(65, M).zone());
        assertEquals("typisch 50–65 %", Ranges.water(55, M).note);
        assertEquals("typisch 45–60 %", Ranges.water(47, W).note);
        assertEquals(Ranges.Zone.GOOD, Ranges.water(47, W).zone());
    }

    @Test
    public void muscleAgainstJanssenForTheHeight() {
        // 180 cm: high risk at or below 8.50 * 3.24 = 27.54 kg, normal from 10.76 * 3.24 = 34.86 -> 34.9 kg
        assertEquals(Ranges.Zone.HIGH, Ranges.muscle(27.5, 180, M).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.muscle(27.6, 180, M).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.muscle(34.8, 180, M).zone());
        assertEquals(Ranges.Zone.GOOD, Ranges.muscle(34.9, 180, M).zone());
        assertEquals("gut ab 34,9 kg", Ranges.muscle(36, 180, M).note);
        assertNull(Ranges.muscle(30, 0, M));
        assertNull(Ranges.muscle(30, 180, Profile.UNSET));
    }

    @Test
    public void bmiAfterTheWho() {
        assertEquals(Ranges.Zone.GOOD, Ranges.bmi(22).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.bmi(18.4).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.bmi(26.2).zone());   // the test man: 85 kg / 1.80² = 26.2
        assertEquals(Ranges.Zone.BORDER, Ranges.bmi(24.96).zone());  // shown "25,0"
        assertEquals(Ranges.Zone.HIGH, Ranges.bmi(30).zone());
        assertEquals("normal 18,5–24,9", Ranges.bmi(22).note);
    }

    @Test
    public void girthsAfterWhoAndAshwell() {
        assertEquals(Ranges.Zone.GOOD, Ranges.waist(905, M).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.waist(940, M).zone());
        assertEquals(Ranges.Zone.HIGH, Ranges.waist(1020, M).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.waist(800, W).zone());
        assertEquals("erhöht ab 94, hoch ab 102", Ranges.waist(905, M).note);
        assertFalse(Ranges.waist(0, M).hasValue());
        assertNull(Ranges.waist(905, Profile.UNSET));

        assertEquals(Ranges.Zone.GOOD, Ranges.waistToHeight(49).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.waistToHeight(50).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.waistToHeight(59).zone());
        assertEquals(Ranges.Zone.HIGH, Ranges.waistToHeight(60).zone());
        assertFalse(Ranges.waistToHeight(0).hasValue());
        assertEquals("gut unter 0,5, hoch ab 0,6", Ranges.waistToHeight(52).note);
        // the same cut-offs as the reading in Girths
        for (int h = 30; h <= 90; h++) {
            Girths.Band b = Girths.waistToHeightBand(h);
            Ranges.Zone z = Ranges.waistToHeight(h).zone();
            assertEquals(b == Girths.Band.GOOD ? Ranges.Zone.GOOD : b == Girths.Band.INCREASED ? Ranges.Zone.BORDER
                    : Ranges.Zone.HIGH, z);
        }

        assertEquals(Ranges.Zone.GOOD, Ranges.waistToHip(89, M).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.waistToHip(90, M).zone());
        assertEquals(Ranges.Zone.GOOD, Ranges.waistToHip(84, W).zone());
        assertEquals(Ranges.Zone.BORDER, Ranges.waistToHip(85, W).zone());
        assertEquals("erhöht ab 0,90", Ranges.waistToHip(0, M).note);
        assertEquals("erhöht ab 0,85", Ranges.waistToHip(0, W).note);
        assertNull(Ranges.waistToHip(90, Profile.UNSET));
    }

    @Test
    public void weightAgainstBmiRangesInKg() {
        Ranges.Scale s = Ranges.weight(85.0, 180);           // 18.5 / 25 / 30 x 3.24 m² = 59.9 / 81.0 / 97.2 kg
        assertEquals(Ranges.Zone.BORDER, s.zone());
        assertEquals("Übergewicht", s.word());
        assertEquals("normal 59,9–81,0 kg", s.note);
        assertEquals(Ranges.Zone.GOOD, Ranges.weight(75, 180).zone());
        assertNull(Ranges.weight(85, 0));
    }

    @Test
    public void bandsHaveWordsAndSpans() {
        Ranges.Scale fat = Ranges.fat(18.2, M, 36);
        assertEquals("gesund", fat.word());
        assertEquals("unter 8 %", fat.span(0));
        assertEquals("8–20 %", fat.span(1));
        assertEquals("unter 13 %", Ranges.fat(22, M, 65).span(0));
        assertEquals("ab 25 %", fat.span(3));
        Ranges.Scale bmi = Ranges.bmi(26.2);
        assertEquals("Übergewicht", bmi.word());
        assertEquals("18,5–25,0", bmi.span(1));
        Ranges.Scale whtr = Ranges.waistToHeight(52);
        assertEquals("erhöht", whtr.word());
        assertEquals("unter 0,50", whtr.span(0));
        assertEquals("ab 0,60", whtr.span(2));
        assertEquals("ab 102 cm", Ranges.waist(1000, M).span(2));
        assertEquals("unter 27,5 kg", Ranges.muscle(30, 180, M).span(0));
        assertNull(Ranges.waist(0, M).word());
    }

    @Test
    public void markerStaysOnTheBar() {
        Ranges.Scale s = Ranges.bmi(22);
        assertEquals(0f, s.at(10), 1e-6);
        assertEquals(1f, s.at(55), 1e-6);
        assertEquals(0.28f, s.at(22), 1e-6);   // (22 - 15) / 25
        // the zones cover the axis without gaps
        for (Ranges.Scale x : new Ranges.Scale[]{Ranges.fat(20, M, 36), Ranges.water(55, W), Ranges.muscle(30, 180, M),
                Ranges.bmi(22), Ranges.waist(900, M), Ranges.waistToHeight(50), Ranges.waistToHip(90, W)}) {
            assertEquals(x.min, x.bands[0].from, 1e-9);
            assertEquals(x.max, x.bands[x.bands.length - 1].to, 1e-9);
            for (int i = 1; i < x.bands.length; i++) assertEquals(x.bands[i - 1].to, x.bands[i].from, 1e-9);
            assertTrue(x.note, x.note.length() <= Ranges.NOTE_MAX);   // one line in a tile
        }
    }
}
