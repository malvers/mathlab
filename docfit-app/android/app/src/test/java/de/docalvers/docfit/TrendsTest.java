package de.docalvers.docfit;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * The "Verlauf" tab's data (Trends): the stretches of time, blood pressure and pulse as series (oldest first, readings
 * without a pulse left out of the pulse), only fasting glucose, the times of one exercise in seconds, and the newest
 * value as text. Made-up values - nobody's real ones.
 */
public class TrendsTest {
    private static final long T = 1_795_000_000_000L, DAY = Trends.DAY_MS;

    @Test
    public void stretchesOfTime() {
        assertEquals(T - 28 * DAY, Trends.from(0, T));
        assertEquals(T - 91 * DAY, Trends.from(1, T));
        assertEquals(T - 365 * DAY, Trends.from(2, T));
        assertEquals(Long.MIN_VALUE, Trends.from(3, T));
        List<History.Point> pts = new ArrayList<>();
        pts.add(new History.Point(T - 40 * DAY, 1));
        pts.add(new History.Point(T - 10 * DAY, 2));
        assertEquals(1, Trends.since(pts, Trends.from(0, T)).size());
        assertEquals(2, Trends.since(pts, Trends.from(3, T)).size());
    }

    @Test
    public void bloodPressureOldestFirst() {
        List<Pressures.Reading> newestFirst = new ArrayList<>();
        newestFirst.add(new Pressures.Reading(T, 125, 82, 0, Pressures.OMRON, ""));
        newestFirst.add(new Pressures.Reading(T - DAY, 131, 85, 64, Pressures.HAND, ""));
        List<History.Point> sys = Trends.pressure(newestFirst, Trends.SYS);
        assertEquals(131, sys.get(0).value, 0);
        assertEquals(125, sys.get(1).value, 0);
        assertEquals(82, Trends.pressure(newestFirst, Trends.DIA).get(1).value, 0);
        List<History.Point> pulse = Trends.pressure(newestFirst, Trends.PULSE);
        assertEquals(1, pulse.size());   // the reading without a pulse is left out
        assertEquals(64, pulse.get(0).value, 0);
    }

    @Test
    public void onlyFastingGlucose() {
        List<Glucoses.Reading> newestFirst = new ArrayList<>();
        newestFirst.add(new Glucoses.Reading(T, 140, "after_meal_2h", "hand", ""));
        newestFirst.add(new Glucoses.Reading(T - DAY, 92, "fasting", "hand", ""));
        List<History.Point> f = Trends.fastingGlucose(newestFirst);
        assertEquals(1, f.size());
        assertEquals(92, f.get(0).value, 0);
    }

    @Test
    public void timesOfOneExercise() {
        List<Entries.Entry> newestFirst = new ArrayList<>();
        newestFirst.add(new Entries.Entry(T, 94_661, "Planks"));
        newestFirst.add(new Entries.Entry(T - DAY, 57_857, "Two Balls"));
        newestFirst.add(new Entries.Entry(T - 2 * DAY, 78_901, "Planks"));
        List<History.Point> planks = Trends.runs(newestFirst, "Planks");
        assertEquals(2, planks.size());
        assertEquals(78.901, planks.get(0).value, 1e-9);
        assertEquals("1:35", Trends.clock(planks.get(1).value));
        assertEquals("0:58", Trends.clock(57.857));
    }

    @Test
    public void setsAreNoTimesAndCountPerMove() {
        List<Entries.Entry> newestFirst = new ArrayList<>();
        newestFirst.add(new Entries.Entry(T, 0, "Dumbbells", 10, 4, "Lateral Raises"));
        newestFirst.add(new Entries.Entry(T - DAY, 0, "Dumbbells", 12, 5, "Curls"));
        newestFirst.add(new Entries.Entry(T - 2 * DAY, 41_000, "Dumbbells"));   // a time from before it counted
        newestFirst.add(new Entries.Entry(T - 3 * DAY, 0, "Dumbbells", 9, 5, "Curls"));
        newestFirst.add(new Entries.Entry(T - 4 * DAY, 0, "Dumbbells", 7, 3, "Rows"));   // a name from before a rename
        newestFirst.add(new Entries.Entry(T - 5 * DAY, 0, "Legs", 15, 0, ""));
        // the times only: the sets are no times
        assertEquals(1, Trends.runs(newestFirst, "Dumbbells").size());
        assertEquals(41, Trends.runs(newestFirst, "Dumbbells").get(0).value, 1e-9);
        assertTrue(Trends.runs(newestFirst, "Legs").isEmpty());
        // one card per move: its own moves in their order first, then others
        assertEquals(java.util.Arrays.asList("Curls", "Lateral Raises", "Rows"), Trends.setMoves(newestFirst, "Dumbbells"));
        assertEquals(java.util.Arrays.asList(""), Trends.setMoves(newestFirst, "Legs"));
        assertTrue(Trends.setMoves(newestFirst, "Planks").isEmpty());
        List<Entries.Entry> curls = Trends.sets(newestFirst, "Dumbbells", "Curls");
        assertEquals(2, curls.size());
        List<History.Point> reps = Trends.reps(curls);
        assertEquals(9, reps.get(0).value, 0);          // oldest first
        assertEquals(12, reps.get(1).value, 0);
        assertEquals(T - DAY, reps.get(1).time);
        assertEquals(1, Trends.setsSince(curls, T - 2 * DAY).size());
        assertEquals("12 × 5 kg", Entries.setText(curls.get(curls.size() - 1)));
    }

    @Test
    public void newestValueAsText() {
        List<History.Point> pts = new ArrayList<>();
        assertEquals("–", Trends.latest(pts, 1, "kg"));
        pts.add(new History.Point(T - DAY, 79.45));
        pts.add(new History.Point(T, 78.1));
        assertEquals("78,1 kg", Trends.latest(pts, 1, "kg"));
        assertTrue(Trends.latest(pts, 0, "").matches("\\d+"));
    }
}
