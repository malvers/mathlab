package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * The fitness score (FitnessScore) at the borders of its bands: ACE categories, Gallagher's age groups, the WHO BMI
 * limits and the Janssen 2004 muscle limit. All values are made up for the test - no one's real data.
 */
public class FitnessScoreTest {
    private static final char M = Profile.MALE, W = Profile.FEMALE;
    private static final double NAN = Double.NaN, BMI_OK = 22.0;

    /** Score from body fat with a normal BMI and no muscle value. */
    private static int score(double fat, int age, char sex) {
        return FitnessScore.of(fat, BMI_OK, NAN, 180, age, sex).score;
    }

    @Test
    public void wordsForTheScores() {
        assertEquals("grottenschlecht", FitnessScore.word(1));
        assertEquals("grottenschlecht", FitnessScore.word(2));
        assertEquals("ausbaufähig", FitnessScore.word(3));
        assertEquals("ausbaufähig", FitnessScore.word(4));
        assertEquals("solide", FitnessScore.word(5));
        assertEquals("solide", FitnessScore.word(6));
        assertEquals("fit", FitnessScore.word(7));
        assertEquals("fit", FitnessScore.word(8));
        assertEquals("Top-Athlet", FitnessScore.word(9));
        assertEquals("Top-Athlet", FitnessScore.word(10));
        assertEquals("", FitnessScore.word(0));
    }

    @Test
    public void youngMenAtTheBorders() {
        assertEquals(7, score(5.9, 30, M));     // essential fat only
        assertEquals(10, score(6.0, 30, M));    // ACE athletes from 6 %
        assertEquals(10, score(9.9, 30, M));
        assertEquals(9, score(10.0, 30, M));
        assertEquals(9, score(13.9, 30, M));
        assertEquals(8, score(14.0, 30, M));    // ACE fitness from 14 %
        assertEquals(7, score(17.9, 30, M));
        assertEquals(6, score(18.0, 30, M));    // ACE average from 18 %
        assertEquals(5, score(19.9, 30, M));
        assertEquals(4, score(20.0, 30, M));    // Gallagher 20-39: healthy below 20 %
        assertEquals(3, score(24.9, 30, M));
        assertEquals(2, score(25.0, 30, M));    // Gallagher 20-39: obese from 25 %
        assertEquals(2, score(29.9, 30, M));
        assertEquals(1, score(30.0, 30, M));
    }

    @Test
    public void menFortyToFiftyNine() {
        assertEquals(9, score(15.9, 45, M));    // athletes moved up by 2
        assertEquals(8, score(16.0, 45, M));
        assertEquals(6, score(20.0, 45, M));    // average moved up by 2
        assertEquals(5, score(21.9, 45, M));
        assertEquals(4, score(22.0, 45, M));    // Gallagher 40-59: healthy below 22 %
        assertEquals(2, score(28.0, 45, M));    // Gallagher 40-59: obese from 28 %
    }

    @Test
    public void menSixtyAndOlder() {
        assertEquals(9, score(18.9, 65, M));    // athletes moved up by 5
        assertEquals(8, score(19.0, 65, M));
        assertEquals(6, score(23.0, 65, M));
        assertEquals(5, score(24.9, 65, M));
        assertEquals(4, score(25.0, 65, M));    // Gallagher 60-79: healthy below 25 %
        assertEquals(2, score(30.0, 65, M));    // Gallagher 60-79: obese from 30 %
        assertEquals(score(25.0, 65, M), score(25.0, 85, M));   // beyond 79 like 60-79
    }

    @Test
    public void youngWomenAtTheBorders() {
        assertEquals(7, score(13.9, 30, W));
        assertEquals(10, score(14.0, 30, W));   // ACE athletes from 14 %
        assertEquals(9, score(20.9, 30, W));
        assertEquals(8, score(21.0, 30, W));    // ACE fitness from 21 %
        assertEquals(6, score(25.0, 30, W));    // ACE average from 25 %
        assertEquals(5, score(32.9, 30, W));
        assertEquals(4, score(33.0, 30, W));    // Gallagher 20-39: healthy below 33 %
        assertEquals(2, score(39.0, 30, W));    // Gallagher 20-39: obese from 39 %
        assertEquals(1, score(45.0, 30, W));
    }

    @Test
    public void olderWomen() {
        assertEquals(4, score(34.0, 50, W));    // Gallagher 40-59
        assertEquals(2, score(40.0, 50, W));
        assertEquals(8, score(24.0, 70, W));    // fitness moved up by 3
        assertEquals(4, score(36.0, 70, W));    // Gallagher 60-79
        assertEquals(2, score(42.0, 70, W));
    }

    @Test
    public void shownValueDecides() {
        assertEquals(4, score(19.96, 30, M));   // shown as "20,0 %"
    }

    @Test
    public void bmiCorrectsByOnePoint() {
        assertEquals(9, FitnessScore.of(8.0, 18.4, NAN, 180, 30, M).score);   // WHO underweight
        assertEquals(10, FitnessScore.of(8.0, 18.5, NAN, 180, 30, M).score);
        assertEquals(6, FitnessScore.of(18.0, 29.9, NAN, 180, 30, M).score);  // overweight by BMI costs nothing
        assertEquals(5, FitnessScore.of(18.0, 30.0, NAN, 180, 30, M).score);  // WHO obese
        assertEquals(1, FitnessScore.of(30.0, 35.0, NAN, 180, 30, M).score);  // never below 1
    }

    @Test
    public void lowMuscleCorrectsByOnePoint() {
        // 1.80 m: 8.50 kg/m² = 27.54 kg
        assertEquals(7, FitnessScore.of(14.0, BMI_OK, 27.5, 180, 30, M).score);
        assertEquals(8, FitnessScore.of(14.0, BMI_OK, 27.6, 180, 30, M).score);
        // 1.60 m: 5.75 kg/m² = 14.72 kg
        assertEquals(7, FitnessScore.of(21.0, BMI_OK, 14.7, 160, 30, W).score);
        assertEquals(8, FitnessScore.of(21.0, BMI_OK, 14.8, 160, 30, W).score);
        // both corrections
        FitnessScore both = FitnessScore.of(14.0, 31.0, 27.0, 180, 30, M);
        assertEquals(6, both.score);
        assertTrue(both.text, both.text.contains("Je ein Punkt Abzug: BMI 31,0 (WHO: Adipositas), wenig Muskelmasse"));
    }

    @Test
    public void noScoreWithoutFatOrProfile() {
        FitnessScore noFat = FitnessScore.of(NAN, BMI_OK, NAN, 180, 30, M);
        assertEquals(0, noFat.score);
        assertEquals(FitnessScore.HINT_FAT, noFat.text);
        assertEquals(FitnessScore.HINT_PROFILE, FitnessScore.of(20, BMI_OK, NAN, 180, 0, M).text);
        assertEquals(FitnessScore.HINT_PROFILE, FitnessScore.of(20, BMI_OK, NAN, 180, 30, Profile.UNSET).text);
        assertEquals(0, FitnessScore.of(20, BMI_OK, NAN, 180, 30, Profile.UNSET).score);
    }

    @Test
    public void weighInWithoutResistanceOrProfileHasNoScore() {
        Weighings.Weighing weightOnly = new Weighings.Weighing(1_700_000_000_000L, 8000, 0);
        Profile full = new Profile(180, 1990, M);
        assertEquals(FitnessScore.HINT_FAT, FitnessScore.of(weightOnly, full).text);
        Weighings.Weighing measured = new Weighings.Weighing(1_700_000_000_000L, 8000, 500);
        assertEquals(FitnessScore.HINT_PROFILE, FitnessScore.of(measured, new Profile(180, 0, M)).text);
        assertTrue(FitnessScore.of(measured, full).score > 0);
    }

    @Test
    public void sentencesSayWhatTheValuesMean() {
        assertEquals("Körperfett 24,0 %: für Männer ab 60 im gesunden Bereich, Sportler liegen unter 23 %. "
                + "BMI 22,0 – laut WHO Normalgewicht.", FitnessScore.of(24.0, BMI_OK, NAN, 180, 65, M).text);
        assertEquals("Körperfett 12,0 %: für Männer bis 39 im Bereich von Leistungssportlern. "
                + "BMI 26,0 – laut WHO Übergewicht.", FitnessScore.of(12.0, 26.0, NAN, 180, 30, M).text);
        assertEquals("Körperfett 36,0 %: für Frauen von 40 bis 59 etwas viel – gesund ist unter 34 %. "
                + "Ein Punkt Abzug: BMI 30,5 (WHO: Adipositas).", FitnessScore.of(36.0, 30.5, NAN, 165, 50, W).text);
        assertTrue(FitnessScore.of(4.0, BMI_OK, NAN, 180, 30, M).text.contains("auf Dauer zu wenig"));
    }
}
