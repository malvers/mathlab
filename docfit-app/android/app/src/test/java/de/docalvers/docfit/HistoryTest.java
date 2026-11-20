package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.Arrays;
import java.util.List;

/**
 * The course in the detail sheets (History): points oldest first, weigh-ins without the value left out, the waist's
 * goal lines from the profile, the y axis. Made-up data of the test man (180 cm, born 1990, male) - nobody real.
 */
public class HistoryTest {
    private static final long DAY = 86_400_000L, T = 1_795_000_000_000L;
    private static final Profile MAN = new Profile(180, 1990, Profile.MALE);
    private static final Profile WOMAN = new Profile(165, 1990, Profile.FEMALE);

    // newest first, as Weighings keeps them: three days, the waist only on two, a weight-only day in between
    private static final List<Weighings.Weighing> ROWS = Arrays.asList(
            new Weighings.Weighing(T + 2 * DAY, 8420, 520, 960, 1000),
            new Weighings.Weighing(T + DAY, 8460, 0),
            new Weighings.Weighing(T, 8500, 512, 985, 0));

    @Test
    public void seriesIsOldestFirstAndSkipsMissingValues() {
        List<History.Point> w = History.series(ROWS, TileInfo.Key.WEIGHT, MAN);
        assertEquals(3, w.size());
        assertEquals(T, w.get(0).time);
        assertEquals(85.0, w.get(0).value, 1e-9);
        assertEquals(84.2, w.get(2).value, 1e-9);
        List<History.Point> waist = History.series(ROWS, TileInfo.Key.WAIST, MAN);
        assertEquals(2, waist.size());                        // the weight-only day has no waist
        assertEquals(98.5, waist.get(0).value, 1e-9);
        assertEquals(96.0, waist.get(1).value, 1e-9);
        assertEquals(2, History.series(ROWS, TileInfo.Key.FAT, MAN).size());    // no resistance on day 2
        assertEquals(1, History.series(ROWS, TileInfo.Key.WHR, MAN).size());    // the hip only on the newest
        assertEquals(1.0 * 960 / 1000, History.series(ROWS, TileInfo.Key.WHR, MAN).get(0).value, 1e-9);
        assertEquals(0.53, History.series(ROWS, TileInfo.Key.WHTR, MAN).get(1).value, 1e-9);   // 96 / 180, cut
        assertEquals(0, History.series(ROWS, TileInfo.Key.FAT, new Profile(0, 0, Profile.UNSET)).size());
    }

    @Test
    public void waistGoalsComeFromTheProfile() {
        List<History.Goal> g = History.goals(TileInfo.Key.WAIST, MAN);
        assertEquals(3, g.size());
        assertEquals("< 102 WHO rot", g.get(0).label);
        assertEquals("< 94 WHO grün", g.get(1).label);
        assertEquals("< 90 Bauch/Größe 0,5", g.get(2).label);   // half of 180 cm
        assertEquals(90, g.get(2).value, 1e-9);
        List<History.Goal> w = History.goals(TileInfo.Key.WAIST, WOMAN);
        assertEquals("< 88 WHO rot", w.get(0).label);
        assertEquals("< 80 WHO grün", w.get(1).label);
        assertEquals("< 83 Bauch/Größe 0,5", w.get(2).label);   // 82.5 rounds to 83
        assertEquals(0, History.goals(TileInfo.Key.FAT, MAN).size());
        assertEquals(2, History.goals(TileInfo.Key.WAIST, new Profile(0, 1990, Profile.MALE)).size());   // no height
    }

    @Test
    public void scalesForTheSheets() {
        Weighings.Weighing newest = ROWS.get(0);
        assertEquals(Ranges.Zone.BORDER, History.scale(newest, TileInfo.Key.WAIST, MAN).zone());   // 96 cm: 94-102
        assertEquals("erhöht", History.scale(newest, TileInfo.Key.WAIST, MAN).word());
        assertNull(History.scale(newest, TileInfo.Key.HIP, MAN));                  // no threshold of its own
        assertEquals(Ranges.Zone.BORDER, History.scale(newest, TileInfo.Key.WEIGHT, MAN).zone());  // BMI 26
        assertEquals("Übergewicht", History.scale(newest, TileInfo.Key.WEIGHT, MAN).word());
        assertEquals(2, History.decimals(TileInfo.Key.WHTR));
        assertEquals("cm", History.unit(TileInfo.Key.WAIST));
        assertEquals("", History.unit(TileInfo.Key.BMI));
    }

    @Test
    public void yAxisHoldsPointsAndGoals() {
        List<History.Point> waist = History.series(ROWS, TileInfo.Key.WAIST, MAN);
        double[] y = History.yRange(waist, History.goals(TileInfo.Key.WAIST, MAN), History.minSpan(1));
        assertTrue(y[0] < 90 && y[1] > 102);                 // the 0.5 line and WHO red both in sight
        double[] one = History.yRange(History.series(ROWS, TileInfo.Key.WHR, MAN), History.goals(TileInfo.Key.WHR, MAN),
                History.minSpan(2));
        assertTrue(one[1] - one[0] >= 0.05);                 // a single point still gets an axis
        assertTrue(one[0] < 0.96 && one[1] > 0.96);
    }
}
